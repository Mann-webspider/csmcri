import { execSync } from "child_process";

export const getMacAddress = (ip: string): string => {
  try {
    const output = execSync(`arp -n ${ip}`).toString(); // Run `arp` command
    const macRegex = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/; // Extract MAC
    const match = output.match(macRegex);
    return match ? match[0] : "MAC not found";
  } catch (error) {
    return "MAC lookup failed";
  }
};
 