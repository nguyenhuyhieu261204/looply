import { models } from "#config";

const { User } = models;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createUserWithUniqueUsername = async (userData) => {
  const basename = userData.fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

  let attempt = 0;
  const maxAttempts = 100;
  const delay = 100;

  while (attempt < maxAttempts) {
    const suffix = attempt === 0 ? "" : attempt;
    const candidate = `${basename}${suffix}`;

    try {
      const user = await User.create({
        ...userData,
        username: candidate,
      });
      return user;
    } catch (error) {
      const code = error?.original?.code || error?.parent?.code;

      if (error.name === "SequelizeUniqueConstraintError" || code === "23505") {
        attempt++;
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  throw new Error("Failed to create unique username after maximum attempts");
};

export const findOrCreateUserFromGoogle = async (googleProfile) => {
  let user = await User.findOne({ where: { googleId: googleProfile.id } });

  const userData = {
    email: googleProfile.emails[0].value,
    fullName: googleProfile.displayName,
    googleId: googleProfile.id,
    profilePicture: googleProfile.photos[0].value,
    lastActive: new Date(),
  };

  if (!user) {
    user = await createUserWithUniqueUsername(userData);
  } else {
    let updated = false;
    for (const key of ["email", "fullName", "profilePicture"]) {
      if (user[key] !== userData[key]) {
        user[key] = userData[key];
        updated = true;
      }
    }
    if (updated || !user.lastActive) {
      user.lastActive = new Date();
      await user.save();
    }
  }

  return user;
};
