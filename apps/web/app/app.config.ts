export default defineAppConfig({
  ui: {
    colors: {
      primary: "green",
      neutral: "zinc",
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    navigationMenu: {
      slots: {
        link: "py-2! my-0.5! cursor-pointer",
      },
      variants: {
        active: {
          true: {
            link: "before:bg-elevated/50! before:border-default/75 before:border",
          },
        },
      },
    },
    dashboardSidebar: {
      slots: {
        root: "w-64! border-none py-2!",
      },
    },
    dashboardPanel: {
      slots: {
        root: "p-4 pl-0",
        body: "bg-elevated/50 rounded-b-lg border border-default/75",
      },
    },
    dashboardNavbar: {
      slots: {
        root: "bg-elevated/50 rounded-t-lg border border-default/75 border-b-0",
      },
    },
  },
});
