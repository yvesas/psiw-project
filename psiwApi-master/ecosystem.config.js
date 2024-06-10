module.exports = {
    apps: [
        {
            name: "Psiw app",
            script: "npm",
            automation: false,
            args: "run start",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
}
