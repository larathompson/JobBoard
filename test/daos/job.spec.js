const assert = require('chai').assert;
const sinon = require('sinon');

const { DateTime } = require('luxon');
const JobDao = require('../../src/daos/job');
const { exception } = require('console');

describe('Dao: Job', function () {
  describe('_JobRowtoJobData', function () {
    it('correctly maps a JobRow to JobData', function () {
      const dao = new JobDao();

      const jobRow = {
        id: 1,
        title: '2',
        location: '3',
        salary: '4',
        job_type: '5',
        summary: '6',
        description: '7',
        date_posted: '2020-01-01',
      };

      const jobData = dao._JobRowtoJobData(jobRow);

      assert.equal(jobData.id, 1);
      assert.equal(jobData.title, 2);
      assert.equal(jobData.location, 3);
      assert.equal(jobData.salary, 4);
      assert.equal(jobData.jobType, 5);
      assert.equal(jobData.summary, 6);
      assert.equal(jobData.description, 7);

      assert.instanceOf(jobData.datePosted, DateTime);
    });
  });
  describe('fetchAllJobs', function () {
    it('Resolves an array of job data', async function () {
      const mockJobStore = {
        fetchAllJobs: sinon.stub().returns([
          {
            id: 1,
          },
        ]),
      };

      const dao = new JobDao(mockJobStore);

      const jobData = await dao.fetchAllJobs();

      assert.isArray(jobData);
    });
  });
  describe('fetchJobById', function () {
    it('responds with the requested record', async function () {
      const mockJobStore = {
        fetchJobById: sinon.stub().returns({
          id: 1,
        }),
      };

      const dao = new JobDao(mockJobStore);

      const jobData = await dao.fetchJobById(1);

      assert.equal(jobData.id, 1);
    });
    it('responds null when db returns undefined', async function () {
      const mockJobStore = {
        fetchJobById: sinon.stub().resolves(undefined),
      };

      const dao = new JobDao(mockJobStore);

      const response = await dao.fetchJobById(1);

      assert.strictEqual(response, null);
    });
  });
  describe('createJob', function () {
    it('correctly calls the createJob store method', async function () {
      const mockJobStore = {
        createJob: sinon.stub().returns({
          id: 1,
          title: '1',
          location: '2',
          salary: '3',
          job_type: '4',
          summary: '5',
          description: '6',
          date_posted: '2020-01-01',
        }),
      };

      const dao = new JobDao(mockJobStore);

      const mockDate = DateTime.local();

      const jobData = await dao.createJob({
        title: '1',
        location: '2',
        salary: '3',
        jobType: '4',
        summary: '5',
        description: '6',
        datePosted: mockDate,
      });

      assert.deepEqual(Object.keys(jobData), [
        'id',
        'title',
        'location',
        'salary',
        'jobType',
        'summary',
        'description',
        'datePosted',
      ]);

      assert.deepEqual(mockJobStore.createJob.getCall(0).args[0], {
        title: '1',
        location: '2',
        salary: '3',
        job_type: '4',
        summary: '5',
        description: '6',
        date_posted: mockDate.toJSDate(),
      });
    });
  });
  describe('updateJob', function () {
    it('correctly calls the updateJob store method', async function () {
      const mockJobStore = {
        updateJob: sinon.stub().returns({
          id: 1,
          title: '1',
          location: '2',
          salary: '3',
          job_type: '4',
          summary: '5',
          description: '6',
          datePosted: '2020-01-01',
        }),
      };

      const dao = new JobDao(mockJobStore);

      const jobData = await dao.updateJob(1, {
        title: '1',
        location: '2',
        salary: '3',
        jobType: '4',
        summary: '5',
        description: '6',
      });

      assert.deepEqual(Object.keys(jobData), [
        'id',
        'title',
        'location',
        'salary',
        'jobType',
        'summary',
        'description',
        'datePosted',
      ]);

      assert.deepEqual(mockJobStore.updateJob.getCall(0).args[1], {
        title: '1',
        location: '2',
        salary: '3',
        job_type: '4',
        summary: '5',
        description: '6',
      });
    });
  });
  describe('deleteJob', function () {
    it('correctly calls the updateJob store method', async function () {
      const mockJobStore = {
        deleteJob: sinon.stub().resolves(),
      };

      const dao = new JobDao(mockJobStore);

      await dao.deleteJob(1);

      assert.equal(mockJobStore.deleteJob.getCall(0).args[0], 1);
    }),
      it('returns null if there is an exception', async function () {
        const mockJobStore = {
          deleteJob: sinon.stub().throws(exception),
        };

        const dao = new JobDao(mockJobStore);

        const funcResponse = await dao.deleteJob(1);

        assert.equal(funcResponse, null);
      });
  });
});
