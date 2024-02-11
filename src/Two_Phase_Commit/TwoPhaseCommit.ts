import express, { Request, Response } from 'express';
import { EventEmitter } from 'events';

class Coordinator extends EventEmitter {
  private cohortNodes: CohortNode[];

  constructor(cohortNodes: CohortNode[]) {
    super();
    this.cohortNodes = cohortNodes;
  }

  async startTransaction(): Promise<void> {
    try {
      // Phase 1: Voting Phase
      const preparePromises = this.cohortNodes.map(node => {
        return node.prepare();
      });
      const prepareResults = await Promise.all(preparePromises);

      // Check if all nodes voted to commit
      const allVotes = prepareResults.every(result => result === 'vote_commit');

      // Phase 2: Decision Phase
      if (allVotes) {
        const commitPromises = this.cohortNodes.map(node => {
          return node.commit();
        });
        await Promise.all(commitPromises);
        this.emit('commit');
      } else {
        const abortPromises = this.cohortNodes.map(node => {
          return node.abort();
        });
        await Promise.all(abortPromises);
        this.emit('abort');
      }
    } catch (error) {
      console.error('Error occurred during two-phase commit:', error);
      this.emit('error', error);
    }
  }
}

class CohortNode {
  constructor() {}

  async prepare(): Promise<string> {
    // Simulate some logic for preparing
    return 'vote_commit'; // In a real scenario, this would be determined based on some condition
  }

  async commit(): Promise<void> {
    // Simulate committing
    console.log('Committing transaction...');
  }

  async abort(): Promise<void> {
    // Simulate aborting
    console.log('Aborting transaction...');
  }
}

const app = express();
const port = 3000;

app.post('/api/transaction', async (req: Request, res: Response) => {
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

  coordinator.on('error', (error: Error) => {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Error occurred during transaction.' });
  });

  await coordinator.startTransaction();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});