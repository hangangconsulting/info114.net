import { stitch } from "@google/stitch-sdk";

async function run() {
  const project = stitch.project("6895139091114525461");
  const screen = await project.getScreen("258bd5e7453847429744cbee10b075d5");
  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();
  console.log("HTML URL:", htmlUrl);
  console.log("Image URL:", imageUrl);
}

run().catch(console.error);
