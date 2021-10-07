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

    get tokens() {
        return this.userData.tokens;
    }

    get activationToken() {
        return this.userData.activationToken;
    }

    get activationTokenExpiry() {
        return this.userData.activationTokenExpiry;
    }

    get resetToken() {
        return this.userData.resetToken;
    }

    get tokenExpires() {
        return this.userData.tokenExpires;
    }

    get blockList() {
        return this.userData.blockList || [];
    }

    set blockList(value) {
        this.userData.blockList = value;
    }

    get password() {
        return this.userData.password;
    }

    get permissions() {
        return this.userData.permissions || [];
    }

    get email() {
        return this.userData.email;
    }

    get enableGravatar() {
        return this.userData.enableGravatar;
    }

    get verified() {
        return this.userData.verified;
    }

    get registered() {
        return this.userData.registered;
    }

    get isAdmin() {
        return this.userData.permissions && this.userData.permissions.isAdmin;
    }

    get isContributor() {
        return this.userData.permissions && this.userData.permissions.isContributor;
    }

    get isSupporter() {
        return this.userData.permissions && this.userData.permissions.isSupporter;
    }

    get role() {
        if(this.isAdmin) {
            return 'admin';
        }

        if(this.isContributor) {
            return 'contributor';
        }

        if(this.isSupporter) {
            return 'supporter';
        }

        return 'user';
    }

    get avatar() {
        return this.userData && this.userData.settings && this.userData.settings.avatar;
    }

    get patreon() {
        return this.userData.patreon;
    }

    set patreon(value) {
        this.userData.patreon = value;
    }

    block(otherUser) {
        this.userData.blockList = this.userData.blockList || [];
        this.userData.blockList.push(otherUser.username.toLowerCase());
    }

    hasUserBlocked(otherUser) {
        return this.blockList.includes(otherUser.username.toLowerCase());
    }

    getFullDetails() {
        let user = Object.assign({}, this.userData);

        delete user.password;

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getWireSafeDetails() {
        let user = {
            _id: this.userData._id,
            avatar: this.userData.settings && this.userData.settings.avatar,
            email: this.userData.email,
            permissions: this.userData.permissions,
            promptedActionWindows: this.userData.promptedActionWindows,
            settings: this.userData.settings,
            username: this.userData.username,
            verified: this.userData.verified
        };

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getShortSummary() {
        return {
            avatar: this.avatar,
            name: this.username,
            role: this.role,
            username: this.username
        };
    }

    getDetails() {
        let user = Object.assign({}, this.userData);

        delete user.password;
        delete user.tokens;

        user = Settings.getUserWithDefaultsSet(user);
        user.role = this.role;

        return user;
    }
}

module.exports = User;
