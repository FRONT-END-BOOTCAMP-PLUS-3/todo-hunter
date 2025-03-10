module.exports = {
  apps: [
    {
      // 서버 프로덕션 환경 next 프로세스
      name: "todo-hunter",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      autorestart: true,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
    },
    {
      // 서버 프로덕션 환경 크론잡 워커
      name: "todo-hunter-cron",
      script: "node",
      args: "--loader ts-node/esm lib/crons/worker.ts",
      env: {
        NODE_ENV: "production",
        TS_NODE_PROJECT: "./tsconfig.json",
        TS_NODE_PREFER_TS_EXTS: "true",
      },
      autorestart: true,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/cron-error.log",
      out_file: "logs/cron-out.log",
    },
    {
      // 로컬 개발 환경 next 프로세스
      name: "todo-hunter-dev",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/error-dev.log",
      out_file: "logs/out-dev.log",
      autorestart: true,
    },
    {
      // 로컬 개발 환경 크론잡 워커
      name: "todo-hunter-dev-cron",
      script: "node",
      args: "--loader ts-node/esm lib/crons/worker.ts",
      env: {
        NODE_ENV: "development",
        TS_NODE_PROJECT: "./tsconfig.json",
        TS_NODE_PREFER_TS_EXTS: "true",
      },
      autorestart: true,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/cron-error-dev.log",
      out_file: "logs/cron-out-dev.log",
    },
  ],
};
