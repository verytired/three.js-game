class Score {

    private static _instance: Score = null;

    private score = 0;
    private $viewScore: any = null;

    constructor() {
        if (Score._instance) {
            throw new Error("must use the getInstance.");
        }
        Score._instance = this;
    }

    public static getInstance(): Score {
        if (Score._instance === null) {
            Score._instance = new Score();
            Score._instance.initialize();
        }
        return Score._instance;
    }

    public initialize() {
        this.$viewScore = $("#score");
    }

    public addScore(p) {
        this.score += p;
        this.$viewScore.html("Score:" + this.score);
    }

    public setScore(p) {
        this.score = p;
        this.$viewScore.html("Score:" + this.score);
    }
}
