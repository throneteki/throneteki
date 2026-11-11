import { rateLimit } from 'express-rate-limit';

const FifteenMinutes = 15 * 60 * 1000;
const OneHour = 60 * 60 * 1000;

function createLimiter({ windowMs, limit, keyGenerator, skip, failuresOnly = false }) {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        keyGenerator,
        skip,
        // Handlers reply 200 with success: false on failure, so they flag success explicitly
        skipSuccessfulRequests: failuresOnly,
        requestWasSuccessful: (req, res) => !!res.locals.requestSucceeded,
        handler: (req, res, next, options) => {
            res.status(options.statusCode).send({
                success: false,
                message: 'Too many attempts. Please wait a while and try again.'
            });
        }
    });
}

function usernameKey(getUsername) {
    return (req) => `user:${String(getUsername(req)).toLowerCase()}`;
}

function missingUsername(getUsername) {
    return (req) => typeof getUsername(req) !== 'string';
}

const loginUsername = (req) => req.body?.username;

export const loginIpLimiter = createLimiter({ windowMs: FifteenMinutes, limit: 30 });
// Stops a password being guessed for a single account from many addresses. Only failed logins
// count, so the account owner logging in normally never uses up the allowance.
export const loginUserLimiter = createLimiter({
    windowMs: FifteenMinutes,
    limit: 10,
    keyGenerator: usernameKey(loginUsername),
    skip: missingUsername(loginUsername),
    failuresOnly: true
});

export const refreshIpLimiter = createLimiter({ windowMs: FifteenMinutes, limit: 120 });

export const registerLimiter = createLimiter({ windowMs: OneHour, limit: 20 });
export const accountTokenLimiter = createLimiter({ windowMs: FifteenMinutes, limit: 10 });
export const lookupLimiter = createLimiter({ windowMs: FifteenMinutes, limit: 60 });
