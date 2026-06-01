/** @jsxImportSource @rezi-ui/jsx */
import { createNodeApp } from "@rezi-ui/node";
import * as rezi from "@rezi-ui/jsx";
import Router from "@/router";
import * as fs from "fs";

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

const app = createNodeApp<State>({
  initialState: {
    logo: [
      "  ██     █████     ██  ",
      "   ███  █     █  ███   ",
      "     ███       ███     ",
      "   ███ █████████ ███   ",
      " ████             ████ ",
    ],
    section: 1,
    version: 0,
    bundles: {},
  },
});

const route = new Router(app, "MainRoute", {
  saveOrder: true,
});

route.create([
  {
    id: "MouseInfo",
    component: () => import("@/main/pages/MouseInfo"),
    active: true,
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
        <rezi.Box border="none" width="full" height="full">
          {ActivePageComponent ? (
            ActivePageComponent({ app, state, route })
          ) : (
            <rezi.Text>Loading bundle...</rezi.Text>
          )}
        </rezi.Box>
      }
    />
  );
});

app.keys({
  q: () => app.stop(),

  escape: () => {
    route.back();
  },

  left: () =>
    app.update((s) => ({ ...s, section: Math.max(0, s.section - 1) })),
  right: () =>
    app.update((s) => ({ ...s, section: Math.min(1, s.section + 1) })),
  w: () => app.update((s) => ({ ...s, section: 0 })),
  t: () => app.update((s) => ({ ...s, section: 1 })),
});

await app.start();
