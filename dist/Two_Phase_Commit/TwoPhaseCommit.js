"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_1 = require("events");
class Coordinator extends events_1.EventEmitter {
    constructor(cohortNodes) {
        super();
        this.cohortNodes = cohortNodes;
    }
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Phase 1: Voting Phase
                const preparePromises = this.cohortNodes.map(node => {
                    return node.prepare();
                });
                const prepareResults = yield Promise.all(preparePromises);
                // Check if all nodes voted to commit
                const allVotes = prepareResults.every(result => result === 'vote_commit');
                // Phase 2: Decision Phase
                if (allVotes) {
                    const commitPromises = this.cohortNodes.map(node => {
                        return node.commit();
                    });
                    yield Promise.all(commitPromises);
                    this.emit('commit');
                }
                else {
                    const abortPromises = this.cohortNodes.map(node => {
                        return node.abort();
                    });
                    yield Promise.all(abortPromises);
                    this.emit('abort');
                }
            }
            catch (error) {
                console.error('Error occurred during two-phase commit:', error);
                this.emit('error', error);
            }
        });
    }
}
class CohortNode {
    constructor() { }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate some logic for preparing
            return 'vote_commit'; // In a real scenario, this would be determined based on some condition
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate committing
            console.log('Committing transaction...');
        });
    }
    abort() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate aborting
            console.log('Aborting transaction...');
        });
    }
}
const app = (0, express_1.default)();
const port = 3000;
app.post('/api/transaction', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cohortNode1 = new CohortNode();
    const cohortNode2 = new CohortNode();
    const cohortNode3 = new CohortNode();
    const coordinator = new Coordinator([cohortNode1, cohortNode2, cohortNode3]);
    coordinator.on('commit', () => {
        console.log('Transaction committed successfully.');
        res.status(200).json({ message: 'Transaction committed successfully.' });
    });
    coordinator.on('abort', () => {
        console.log('Transaction aborted.');
        res.status(500).json({ message: 'Transaction aborted.' });
    });
    coordinator.on('error', (error) => {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Error occurred during transaction.' });
    });
    yield coordinator.startTransaction();
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
