/** @jsxImportSource @rezi-ui/jsx */
import { createNodeApp } from "@rezi-ui/node";
import * as rezi from "@rezi-ui/jsx";
import Router from "@/router";
import * as fs from "fs";
import { getStackItem, getStackLength } from "@/main/sections/Tech";

const writeTo = (msg: string) => {
  try {
    fs.appendFileSync("current.log", `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {}
};

console.log = (...args) => {
  const message = args
    .map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
    )
    .join(" ");
  writeTo(message);
};

console.error = (...args) => {
  const message = args
    .map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
    )
    .join(" ");
  writeTo(message);
};

process.on("uncaughtException", (err) => {
  writeTo(`UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  writeTo(
    `UNHANDLED REJECTION: ${reason?.message || reason}\n${reason?.stack || ""}`,
  );
});

process.on("SIGINT", () => {
  console.log("[signal] SIGINT ignored");
});

process.on("SIGTERM", () => {
  console.log("[signal] SIGTERM ignored");
});

process.on("SIGQUIT", () => {
  console.log("[signal] SIGQUIT ignored");
});

const app = createNodeApp<State>({
  initialState: {
    logo: [
      "  ██     █████     ██  ",
      "   ███  █     █  ███   ",
      "     ███       ███     ",
      "   ███ █████████ ███   ",
      " ████             ████ ",
    ],
    section: 0,
    version: 0,
    bundles: {},
    techModal: {
      open: false,
      title: "",
      description: "",
    },
    techSelectedIndex: 0,
  },
});

const route = new Router(app, "MainRoute", {
  saveOrder: true,
});

route.create([
  {
    id: "Support",
    active: true,
    component: () => import("@/main/pages/SupportPage"),
  },
  {
    id: "Introduction",
    component: () => import("@/main/pages/Introduction"),
  },
  {
    id: "Home",
    component: () => import("@/main/pages/Home"),
  },
]);

app.view((state) => {
  route.state = state;
  const ActivePageComponent = route.current(state);

  return (
    <rezi.Page
      p={1}
      gap={1}
      body={
        <rezi.Layers>
          <rezi.Box border="none" width="full" height="full">
            {ActivePageComponent ? (
              ActivePageComponent({ app, state, route })
            ) : (
              <rezi.Text>Loading bundle...</rezi.Text>
            )}
          </rezi.Box>
          {state.techModal.open && (
            <rezi.Modal
              id="tech-modal"
              title={state.techModal.title}
              width={60}
              minHeight={12}
              backdrop={{
                variant: "opaque",
                background: 0x000000,
              }}
              onClose={() => {
                app.update((s) => ({
                  ...s,
                  techModal: { ...s.techModal, open: false },
                }));
              }}
              content={
                <rezi.Column width="full" height="full" px={2} py={1} gap={1}>
                  <rezi.Text wrap>{state.techModal.description}</rezi.Text>
                  <rezi.Spacer flex={1} />
                  <rezi.Divider />
                  <rezi.Row gap={1}>
                    <rezi.Kbd keys="Esc" />
                    <rezi.Text style={{ dim: true }}>to close</rezi.Text>
                  </rezi.Row>
                </rezi.Column>
              }
            />
          )}
        </rezi.Layers>
      }
    />
  );
});

app.keys({
  "ctrl+x": () => {
    route.back();
  },
  escape: () => {
    app.update((s) => {
      if (s.techModal.open) {
        return { ...s, techModal: { ...s.techModal, open: false } };
      }
      return s;
    });
  },
  enter: () => {
    if (route.currentPage === "Support") {
      route.page = "Introduction";
    }

    if (route.currentPage === "Introduction") {
      route.page = "Home";
    }

    if (route.currentPage === "Home") {
      app.update((s) => {
        if (s.section === 1) {
          const item = getStackItem(s.techSelectedIndex);
          if (item?.modal) {
            return {
              ...s,
              techModal: {
                open: true,
                title: item.modal.title ?? item.title,
                description: item.modal.description,
              },
            };
          }
        }
        return s;
      });
    }
  },
  left: () =>
    app.update((s) => ({ ...s, section: Math.max(0, s.section - 1) })),
  right: () =>
    app.update((s) => ({ ...s, section: Math.min(1, s.section + 1) })),
  up: () =>
    app.update((s) => {
      if (route.currentPage === "Home" && s.section === 1) {
        return {
          ...s,
          techSelectedIndex: Math.max(0, s.techSelectedIndex - 1),
        };
      }
      return s;
    }),
  down: () =>
    app.update((s) => {
      if (route.currentPage === "Home" && s.section === 1) {
        return {
          ...s,
          techSelectedIndex: Math.min(
            getStackLength() - 1,
            s.techSelectedIndex + 1,
          ),
        };
      }
      return s;
    }),
  w: () => app.update((s) => ({ ...s, section: 0 })),
  t: () => app.update((s) => ({ ...s, section: 1 })),
});

await app.start();
