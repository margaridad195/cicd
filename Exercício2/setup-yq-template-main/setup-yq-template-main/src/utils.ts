import * as os from "os";
import fs from "fs";

export function getArchitecture(): string {
  const arch = os.arch();
  switch (arch) {
    case "x64":
      return "amd64";
    default:
      return arch;
  }
}
export function makeExecutable(filePath: string): void {
  fs.chmodSync(filePath, "755");
}
