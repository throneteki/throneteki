const Settings = require('../settings');

class User {
    constructor(userData) {
        this.userData = userData;
    }

    get _id() {
        return this.userData._id;
    }

    get disabled() {
        return this.userData.disabled;
    }

    get username() {
        return this.userData.username;
    }

    get emailHash() {
        return this.userData.emailHash;
    }

    get tokens() {
        return this.userData.tokens;
    }

    get activiationToken() {
        return this.userData.activiationToken;
    }

    get activiationTokenExpiry() {
        return this.userData.activiationTokenExpiry;
    }

    get resetToken() {
        return this.userData.resetToken;
    }

    get tokenExpires() {
        return this.userData.tokenExpires;
    }

    get disableGravatar() {
        return this.userData.settings && this.userData.settings.disableGravatar;
    }

    get blockList() {
        return this.userData.blockList || [];
    }

    get password() {
        return this.userData.password;
    }

    getWireSafeDetails() {
        let user = {
            _id: this.userData._id,
            username: this.userData.username,
            email: this.userData.email,
            emailHash: this.userData.emailHash,
            settings: this.userData.settings,
            promptedActionWindows: this.userData.promptedActionWindows,
            permissions: this.userData.permissions,
            verified: this.userData.verified
        };

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getShortSummary() {
        return {
            name: this.username,
            emailHash: this.emailHash,
            noAvatar: this.disableGravatar
        };
    }

    getDetails() {
        let user = this.userData;

        delete user.password;

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }
}

module.exports = User;
