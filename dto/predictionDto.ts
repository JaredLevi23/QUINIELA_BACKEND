

export interface PredictionDTO {

    userId: string;
    predictions: [
        prediction: {
            matchId: string;
            winner: string;
        }
    ];

}