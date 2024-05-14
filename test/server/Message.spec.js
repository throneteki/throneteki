import Message from '../../server/game/Message.js';
import DrawCard from '../../server/game/drawcard.js';
import Spectator from '../../server/game/spectator.js';

describe('Message', function () {
    describe('#flatten', function () {
        describe('when there are no args', function () {
            beforeEach(function () {
                this.message = new Message({ format: 'This is a message', args: {} });
            });

            it('returns the format', function () {
                expect(this.message.flatten()).toEqual(['This is a message']);
            });
        });

        describe('when there are positional arguments', function () {
            it('returns the interpolated arguments', function () {
                const message = new Message({
                    format: '{0} plays {1} to kill {2}',
                    args: ['Player', 'Valar', 'everyone']
                });
                expect(message.flatten()).toEqual([
                    'Player',
                    ' plays ',
                    'Valar',
                    ' to kill ',
                    'everyone'
                ]);
            });

            it('excludes out of index arguments', function () {
                const message = new Message({
                    format: '{0} plays {1} to kill Walder',
                    args: ['Player']
                });
                expect(message.flatten()).toEqual(['Player', ' plays ', ' to kill Walder']);
            });
        });

        describe('when there are named arguments', function () {
            it('returns the interpolated arguments', function () {
                const message = new Message({
                    format: '{player} plays {card} to kill {target}',
                    args: {
                        player: 'Player',
                        card: 'Valar',
                        target: 'everyone'
                    }
                });
                expect(message.flatten()).toEqual([
                    'Player',
                    ' plays ',
                    'Valar',
                    ' to kill ',
                    'everyone'
                ]);
            });

            it('excludes unknown arguments', function () {
                const message = new Message({
                    format: '{player} plays {card} to kill Walder',
                    args: {
                        player: 'Player'
                    }
                });
                expect(message.flatten()).toEqual(['Player', ' plays ', ' to kill Walder']);
            });
        });

        describe('argument formats', function () {
            describe('arrays', function () {
                describe('when there are no elements in the array', function () {
                    beforeEach(function () {
                        this.message = new Message({
                            format: 'Arya kills {targets}',
                            args: {
                                targets: []
                            }
                        });
                    });

                    it('returns the empty string for the argument', function () {
                        expect(this.message.flatten()).toEqual(['Arya kills ', '']);
                    });
                });

                describe('when there is a single element in the array', function () {
                    beforeEach(function () {
                        this.message = new Message({
                            format: 'Arya kills {targets}',
                            args: {
                                targets: ['Walder Frey']
                            }
                        });
                    });

                    it('returns the interpolated argument', function () {
                        expect(this.message.flatten()).toEqual(['Arya kills ', 'Walder Frey']);
                    });
                });

                describe('when there are two elements in the array', function () {
                    beforeEach(function () {
                        this.message = new Message({
                            format: 'Arya kills {targets}',
                            args: {
                                targets: ['Polliver', 'Walder Frey']
                            }
                        });
                    });

                    it('returns the interpolated arguments separated by an and', function () {
                        expect(this.message.flatten()).toEqual([
                            'Arya kills ',
                            'Polliver',
                            ', and ',
                            'Walder Frey'
                        ]);
                    });
                });

                describe('when there are many elements in the array', function () {
                    beforeEach(function () {
                        this.message = new Message({
                            format: 'Arya kills {targets}',
                            args: {
                                targets: ['Polliver', 'Walder Frey', 'House Frey', 'The Night King']
                            }
                        });
                    });

                    it('returns the interpolated arguments separated by commas and an and', function () {
                        expect(this.message.flatten()).toEqual([
                            'Arya kills ',
                            'Polliver',
                            ', ',
                            'Walder Frey',
                            ', ',
                            'House Frey',
                            ', and ',
                            'The Night King'
                        ]);
                    });
                });
            });

            describe('card objects', function () {
                beforeEach(function () {
                    const card = new DrawCard(
                        {},
                        {
                            code: '12345',
                            name: 'Ser Pounce',
                            type: 'character'
                        }
                    );
                    this.message = new Message({
                        format: 'Player 1 plays {card}',
                        args: { card }
                    });
                });

                it('converts the card argument', function () {
                    expect(this.message.flatten()).toEqual([
                        'Player 1 plays ',
                        { argType: 'card', code: '12345', label: 'Ser Pounce', type: 'character' }
                    ]);
                });
            });

            describe('player objects', function () {
                beforeEach(function () {
                    const player = new Spectator('1234', { username: 'Arya' });
                    this.message = new Message({
                        format: '{player} plays Ser Pounce',
                        args: { player }
                    });
                });

                it('converts the player argument', function () {
                    expect(this.message.flatten()).toEqual([
                        { argType: 'nonAvatarPlayer', name: 'Arya' },
                        ' plays Ser Pounce'
                    ]);
                });
            });

            describe('nested messages', function () {
                beforeEach(function () {
                    this.nestedMessage = new Message({
                        format: 'draw {amount} cards',
                        args: {
                            amount: 3
                        }
                    });
                    this.parentMessage = new Message({
                        format: '{player} plays {card} to {nestedMessage}',
                        args: {
                            player: 'Player',
                            card: 'Valar',
                            nestedMessage: this.nestedMessage
                        }
                    });
                });

                it('interpolates and flattens the two messages', function () {
                    expect(this.parentMessage.flatten()).toEqual([
                        'Player',
                        ' plays ',
                        'Valar',
                        ' to ',
                        'draw ',
                        3,
                        ' cards'
                    ]);
                });
            });
        });
    });
});
