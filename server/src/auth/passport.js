const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const env = require("../config/env");
const userModel = require("../models/userModel");

function getPrimaryEmail(profile) {
  if (profile?.emails?.length > 0) {
    return profile.emails[0].value || null;
  }

  return profile?._json?.email || null;
}

function getAvatarUrl(profile) {
  return (
    profile?.photos?.[0]?.value ||
    profile?._json?.picture ||
    profile?._json?.avatar_url ||
    profile?._json?.avatarUrl ||
    null
  );
}

function getProfileUrl(profile) {
  return profile?.profileUrl || profile?._json?.html_url || profile?._json?.url || null;
}

async function upsertOAuthProfile(provider, profile) {
  return userModel.upsertOAuthUser({
    provider,
    providerUserId: profile.id,
    email: getPrimaryEmail(profile),
    name: profile.displayName || profile.username || profile?.name?.givenName || profile?.name?.familyName || null,
    avatarUrl: getAvatarUrl(profile),
    profileUrl: getProfileUrl(profile),
  });
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: new URL("/api/auth/google/callback", env.serverOrigin).toString(),
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await upsertOAuthProfile("google", profile);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: env.githubClientId,
      clientSecret: env.githubClientSecret,
      callbackURL: new URL("/api/auth/github/callback", env.serverOrigin).toString(),
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await upsertOAuthProfile("github", profile);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;