const Answers = require("../models/Answers")
const errorHandler = require("../utils/errorHandler")

module.exports.getAll = async (req, res) => {
    try {
        const answers = await Answers.find().populate("user", "email")
        const parseAnswers = answers.filter(
            (answer) => answer.answers.length > 9
        )
        res.status(200).json(parseAnswers)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAnswersByUserId = async (req, res) => {
    try {
        const answers = await Answers.findOne({
            user: req.params.id,
        })
        res.status(200).json(answers)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async (req, res) => {
    const answers = new Answers({
        answers: [],
        user: req.user.id,
    })
    try {
        await answers.save()
        res.status(201).json(answers)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async (req, res) => {
    try {
        const oldAnswers = await Answers.findById(req.params.id)

        if (oldAnswers.answers.length >= 10) {
            return res.status(400).json({ message: "Quiz done" })
        }

        const answer = [+req.body.answer]
        const updated = {
            answers: [...oldAnswers.answers, ...answer],
        }

        const newAnswers = await Answers.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: updated },
            { new: true }
        )
        res.status(200).json(newAnswers)
    } catch (e) {
        errorHandler(res, e)
    }
}
