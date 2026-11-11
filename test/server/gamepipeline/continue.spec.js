import BaseStep from '../../../server/game/gamesteps/basestep.js';
import GamePipeline from '../../../server/game/gamepipeline.js';

describe('the GamePipeline', function () {
    beforeEach(function () {
        this.pipeline = new GamePipeline();
        this.step1 = new BaseStep(null);
        this.step2 = new BaseStep(null);
    });

    describe('the continue() function', function () {
        describe('when the pipeline is empty', function () {
            beforeEach(function () {
                this.pipeline.initialise([]);
            });

            it('should return true', function () {
                expect(this.pipeline.continue()).toBe(true);
            });
        });

        describe('when a steps continue function returns false', function () {
            beforeEach(function () {
                vi.spyOn(this.step1, 'continue').mockReturnValue(false);
                vi.spyOn(this.step2, 'continue').mockReturnValue(true);
                this.pipeline.initialise([this.step1, this.step2]);
            });

            it('should return false', function () {
                expect(this.pipeline.continue()).toBe(false);
            });

            it('should not call continue on later steps', function () {
                this.pipeline.continue();
                expect(this.step2.continue).not.toHaveBeenCalled();
            });
        });

        describe('when a steps continue function returns true', function () {
            beforeEach(function () {
                vi.spyOn(this.step1, 'continue').mockReturnValue(true);
                vi.spyOn(this.step2, 'continue').mockReturnValue(true);
                this.pipeline.initialise([this.step1, this.step2]);
            });

            it('should return true', function () {
                expect(this.pipeline.continue()).toBe(true);
            });

            it('should call continue on each step', function () {
                this.pipeline.continue();
                expect(this.step1.continue).toHaveBeenCalled();
                expect(this.step2.continue).toHaveBeenCalled();
            });
        });

        describe('when a steps continue function lacks a return value', function () {
            beforeEach(function () {
                vi.spyOn(this.step1, 'continue').mockReturnValue(undefined);
                vi.spyOn(this.step2, 'continue').mockReturnValue(undefined);
                this.pipeline.initialise([this.step1, this.step2]);
            });

            it('should return true', function () {
                expect(this.pipeline.continue()).toBe(true);
            });

            it('should call continue on each step', function () {
                this.pipeline.continue();
                expect(this.step1.continue).toHaveBeenCalled();
                expect(this.step2.continue).toHaveBeenCalled();
            });
        });

        describe('when a step queues more steps', function () {
            beforeEach(function () {
                vi.spyOn(this.step1, 'continue').mockImplementation(() => {
                    this.pipeline.queueStep(this.step2);
                    return false;
                });
                vi.spyOn(this.step2, 'continue').mockReturnValue(false);
                this.pipeline.initialise([this.step1]);
            });

            it('should call continue on the queued step', function () {
                this.pipeline.continue();
                expect(this.step2.continue).toHaveBeenCalled();
            });

            it('should place the queued step before the executed step', function () {
                this.pipeline.continue();
                expect(this.pipeline.pipeline[0]).toBe(this.step2);
                expect(this.pipeline.pipeline[1]).toBe(this.step1);
            });
        });

        describe('when a step is a factory function', function () {
            beforeEach(function () {
                this.container = {
                    factory: () => this.step1
                };
                vi.spyOn(this.container, 'factory');
                // Setup a failing step so execution can happen multiple times.
                vi.spyOn(this.step1, 'continue').mockReturnValue(false);
                this.pipeline.initialise([this.container.factory]);
            });

            it('should only call the factory once', function () {
                this.pipeline.continue();
                this.pipeline.continue();
                expect(this.container.factory.mock.calls.length).toBe(1);
            });

            it('should inline the factory-created step', function () {
                this.pipeline.continue();
                expect(this.pipeline.pipeline[0]).toBe(this.step1);
            });
        });
    });
});
