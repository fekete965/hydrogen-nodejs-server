const { db } = require("../utils/db");

const fetchGroupSuggestions = async (req, res, next) => {
  try {
    const currentUser = res.locals.user
    const groups = await db.group.findMany({
      where:{
       NOT:{
         adminId:currentUser.id
       }
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch groups suggestion",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchMyCreatedGroupPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
      where: {
        author: {
          id: currentUser.id,
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "fetch create group posts",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchMyCreatedGroups = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        admin: {
          id: currentUser.id,
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch my created groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupsInvited = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        invitedPeople: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch groups invited",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupNotifications = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchGroupsFeed = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
        image: true,
        group: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch group feed ",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupsJoined = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        members: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch joined groups",
    });
  } catch (error) {
    next(error);
  }
};
const createGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const {
      name,
      coverImage,
      profileImage,
      privacy,
      invitedPeople = [],
    } = req.body;

    console.log(privacy);
    const group = await db.group.create({
      data: {
        name,
        coverImage,
        profileImage,
        privacy,
        admin: {
          connect: {
            id: currentUser.id,
          },
        },
        invitedPeople: invitedPeople.length
          ? {
              connect: invitedPeople.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });

    return res.status(201).json({
      type: "success",
      message: "Group created successfully",
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};
const createGroupPost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { content, image, groupId } = req.body;
    const post = await db.groupPost.create({
      data: {
        content,
        image,
        author: {
          connect: {
            id: currentUser.id,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Group post created. Will publish when approve from group admin",
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};

const fetchGroupDetails = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        name: true,
        privacy: true,
        coverImage: true,
        profileImage: true,

        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    if (!group) {
      return next({ status: 404, message: "Group not found" });
    }
    return res.status(200).json({
      type: "success",
      message: "Fetch groups suggestion",
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchGroupSuggestions,
  createGroup,
  createGroupPost,
  fetchMyCreatedGroups,
  fetchGroupsInvited,
  fetchMyCreatedGroupPosts,
  fetchGroupNotifications,
  fetchGroupsFeed,
  fetchGroupsJoined,
  fetchGroupDetails,
};
