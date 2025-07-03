const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const { authUser, authAuthor } = require("../middleware/auth");
const validateId = require("../utils/validateId");

const getAllComments = asyncHandler(async (req, res) => {
	const comments = await prisma.comment.findMany({
		orderBy: [
			{
				createdAt: "desc",
			},
		],
		include: {
			user: {
				select: {
					id: true,
					username: true,
					author: true,
				}
			},
			article: {
				select: {
					id: true,
					title: true,
					published: true,
				}
			}
		}
	});

	res.status(200).json(comments);
});

const deleteComment = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		const commentId = validateId(req.params.commentId, "comment");

		const deleteComment = await prisma.comment.delete({
			where: {
				id: commentId,
			}
		});

		res.status(200).json(deleteComment);
	})
];

module.exports = {
	getAllComments,
	deleteComment,
};
