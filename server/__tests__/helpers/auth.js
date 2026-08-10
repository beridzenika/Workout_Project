async function loginAsNewUser(overrides = {}) {
    const userData = {
        username: overrides.username ?? `user_${Date.new()}`,
    }
}