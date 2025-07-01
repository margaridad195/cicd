import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "path";
import * as config from "./config";
import * as fs from "fs/promises";
import * as io from "@actions/io";
import { makeExecutable } from "./utils";

export async function get(version: string, arch: string) {
  try {
    const tempDirectory = process.env["RUNNER_TEMP"] || "";
    if (!tempDirectory) {
      console.error("Temp directory not found.");
      return;
    }

    const toolPath = tc.find(config.TOOL_NAME, version);
    if (!toolPath) {
      const downloadPath = await download(version, arch, tempDirectory);
      console.log("Tool Path:", downloadPath);

      core.addPath(downloadPath);
    } else {
      console.log("Found in cache, skipping download ...");
      core.addPath(toolPath);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An error occurred.");
    }
  }
}

async function download(
  version: string,
  arch: string,
  tempDirectory: string
): Promise<string> {
  const toolDirectoryName = `${config.TOOL_NAME}-${version}`;

  const downloadUrl = config.TOOL_URL_PATTERN.replace(
    /\[VERSION\]/g,
    version
  ).replace(/\[ARCH\]/g, arch);

  console.log(
    `Downloading from ${config.TOOL_DOWNLOAD_SOURCE}: ${downloadUrl}`
  );
  const downloadPath = await tc.downloadTool(downloadUrl);
  console.log(`Download Path: ${downloadPath}`);

  // Create the directory for the downloaded tool
  const toolDirectory = path.join(tempDirectory, toolDirectoryName);
  await fs.mkdir(toolDirectory, { recursive: true });

  // Identify the file extension
  const fileExtension = path.extname(downloadUrl);

  let toolPath;

  if (fileExtension === ".zip") {
    toolPath = await tc.extractZip(downloadPath, toolDirectory);
    console.log(`Extracted Path (ZIP): ${toolPath}`);
  } else if (fileExtension === ".gz" || fileExtension === ".tgz") {
    toolPath = await tc.extractTar(downloadPath, toolDirectory);
    console.log(`Extracted Path (TAR): ${toolPath}`);
  } else if (fileExtension === "") {
    console.log(`Detected binary, skipping extraction`);
    const binary_path = toolDirectory + "/" + config.TOOL_NAME;

    console.log(`Copying to ${binary_path}`);
    await io.cp(downloadPath, binary_path, { recursive: true, force: false });

    console.log(`Making it executable`);
    #TODO something is missing here :)
    console.log(`Done`);

    toolPath = toolDirectory;
  } else {
    throw new Error(`Unsupported file extension: ${fileExtension}`);
  }

  return await tc.cacheDir(toolPath, config.TOOL_NAME, version);
}
