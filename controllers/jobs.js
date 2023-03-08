const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, NotFoundError, BadRequestError } = require('../errors');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: 'desc' });
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
}

// 08:21:00

const getJob = async (req, res) => {
    const { user: { id }, params: { id: jobId } } = req;
    const job = await Job.findOne({
        _id: jobId,
        createdBy: id
    })

    if (!job) {
        throw new NotFoundError('Job does not exist');
    }
    res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.id;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
    } = req;

    if (company === '' || position === '') {
        throw new BadRequestError('Company or position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate(
        {
            _id: jobId, createdBy: userId
        },
        req.body,
        {
            new: true, runValidators: true
        }
    )

    if (!job) {
        throw new NotFoundError(`No Job with Id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
    })

    if (!job) {
        throw new NotFoundError(`No Job with Id ${jobId}`)
    }
    res.status(StatusCodes.OK).send('Deleted')
}

module.exports = {
    getJob,
    getAllJobs,
    createJob,
    updateJob,
    deleteJob
}