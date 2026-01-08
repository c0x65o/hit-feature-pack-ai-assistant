export type CapabilityEndpoint = {
    pathTemplate: string;
    methods: string[];
    summary?: string;
    methodDocs?: Record<string, string>;
    requiredBodyFields?: Record<string, string[]>;
    bodyFields?: Record<string, string[]>;
    queryParams?: string[];
    _featurePack?: string;
    jsonSchema?: Record<string, any>;
    querySchema?: Record<string, any>;
    responseSchema?: Record<string, any>;
};
export type CapabilitiesFile = {
    generated?: boolean;
    kind?: string;
    endpoints?: CapabilityEndpoint[];
};
export type MethodSpec = {
    name: string;
    method: string;
    pathTemplate: string;
    description: string;
    pathParams: string[];
    requiredBodyFields?: string[];
    bodyFields?: string[];
    queryParams?: string[];
    jsonSchema?: any;
    querySchema?: any;
    responseSchema?: any;
    readOnly: boolean;
    /**
     * Optional feature pack name that "owns" this endpoint.
     * Populated from capabilities endpoint `_featurePack` (hit-cli generated).
     */
    featurePack?: string;
};
export declare function methodNameFor(pathTemplate: string, method: string): string;
export declare function loadCapabilitiesFromDisk(projectRoot: string): CapabilitiesFile | null;
export declare function buildMethodCatalog(caps: CapabilitiesFile): MethodSpec[];
//# sourceMappingURL=ai-methods.d.ts.map