type NLPContainer = undefined | any;
export default class ModelLoader {
    private static instance;
    mainNLPContainer: NLPContainer;
    globalResolversNLPContainer: NLPContainer;
    skillsResolversNLPContainer: NLPContainer;
    constructor();
    /**
     * Check if NLP models exists
     */
    hasNlpModels(): boolean;
    /**
     * Load all NLP models at once
     */
    loadNLPModels(): Promise<[void, void, void]>;
    /**
     * Load the global resolvers NLP model from the latest training
     */
    private loadGlobalResolversModel;
    /**
     * Load the skills resolvers NLP model from the latest training
     */
    private loadSkillsResolversModel;
    /**
     * Load the main NLP model from the latest training
     */
    private loadMainModel;
}
export {};
