export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;
  const redirectUrl = "https://discord.com";

  await sendRedirect(event, redirectUrl);
});
