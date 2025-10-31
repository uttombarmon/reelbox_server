import chalk from "chalk";

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue(`[INFO] ${new Date().toISOString()} → ${message}`));
  },
  success: (message: string) => {
    console.log(
      chalk.green(`[SUCCESS] ${new Date().toISOString()} → ${message}`)
    );
  },
  warn: (message: string) => {
    console.log(
      chalk.yellow(`[WARN] ${new Date().toISOString()} → ${message}`)
    );
  },
  error: (message: string, err?: any) => {
    console.error(
      chalk.red(`[ERROR] ${new Date().toISOString()} → ${message}`)
    );
    if (err && process.env.NODE_ENV !== "production") console.error(err);
  },
};
