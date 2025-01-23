import { authMiddleware, BadRequestError } from '@saas2024-23/common';
import { NextFunction, Request, Response, Router } from 'express';
import Solution, { ISolution } from '../models/problem';

const router = Router();

// Helper function to calculate average
const calculateAverage = (arr: number[]): number =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

router.get(
    '/user',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const userSolutions = await Solution.find({ userId });

            const totalProblems = userSolutions.length;
            const solvedProblems = userSolutions.filter(s => s.hasSolution).length;
            const averageDuration = calculateAverage(userSolutions.map(s => s.duration));
            const averageObjective = calculateAverage(
                userSolutions
                    .filter(s => s.hasSolution)
                    .map(s => parseInt(s.solution.objective))
            );
            const averageMaxDistance = calculateAverage(
                userSolutions
                    .filter(s => s.hasSolution)
                    .map(s => s.solution.maxDistance)
            );
            const averageVehiclesUsed = calculateAverage(
                userSolutions
                    .filter(s => s.hasSolution)
                    .map(s => s.solution.vehicles.length)
            );

            res.status(200).json({
                totalProblems,
                solvedProblems,
                averageDuration,
                averageObjective,
                averageMaxDistance,
                averageVehiclesUsed,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/system',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allSolutions = await Solution.find();

            const totalProblems = allSolutions.length;
            const solvedProblems = allSolutions.filter(s => s.hasSolution).length;
            const averageDuration = calculateAverage(allSolutions.map(s => s.duration));
            const averageObjective = calculateAverage(
                allSolutions
                    .filter(s => s.hasSolution)
                    .map(s => parseInt(s.solution.objective))
            );
            const averageMaxDistance = calculateAverage(
                allSolutions
                    .filter(s => s.hasSolution)
                    .map(s => s.solution.maxDistance)
            );
            const averageVehiclesUsed = calculateAverage(
                allSolutions
                    .filter(s => s.hasSolution)
                    .map(s => s.solution.vehicles.length)
            );

            // Get top 5 users by number of problems solved
            const userProblemCounts = allSolutions.reduce((acc, sol) => {
                acc[sol.userId] = (acc[sol.userId] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const topUsers = Object.entries(userProblemCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([userId, count]) => ({ userId, count }));

            res.status(200).json({
                totalProblems,
                solvedProblems,
                averageDuration,
                averageObjective,
                averageMaxDistance,
                averageVehiclesUsed,
                topUsers,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/problem/:submitId',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { submitId } = req.params;
            const problem = await Solution.findOne({ submitId });

            if (!problem) {
                throw new BadRequestError('Problem not found');
            }

            if (!problem.hasSolution) {
                return res.status(200).json({
                    message: 'Problem has no solution yet',
                    duration: problem.duration,
                });
            }

            const vehicleStats = problem.solution.vehicles.map((v, index) => ({
                vehicleIndex: index,
                distance: v.dist,
                stops: v.plan.length,
            }));

            res.status(200).json({
                objective: problem.solution.objective,
                maxDistance: problem.solution.maxDistance,
                duration: problem.duration,
                totalVehicles: problem.solution.vehicles.length,
                vehicleStats,
            });
        } catch (error) {
            next(error);
        }
    }
);

export { router as statisticsRouter };
