module.exports = {
  apps: [
    {
      name: "ShiristiRoy",
      script: "npm",
      args: "start -- -p 3010",
      cwd: "/root/ShiristiRoy/frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
      },
    },
  ],
};
