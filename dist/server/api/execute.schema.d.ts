import { z } from "zod";
export declare const postBodySchema: z.ZodObject<{
    toolName: z.ZodEnum<["http.request", "http.bulk"]>;
    input: z.ZodUnion<[z.ZodObject<{
        method: z.ZodDefault<z.ZodOptional<z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>>>;
        path: z.ZodString;
        query: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        body: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        approved: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        method: "DELETE" | "POST" | "GET" | "PUT" | "PATCH";
        path: string;
        body?: Record<string, unknown> | null | undefined;
        query?: Record<string, unknown> | null | undefined;
        approved?: boolean | undefined;
    }, {
        path: string;
        method?: "DELETE" | "POST" | "GET" | "PUT" | "PATCH" | undefined;
        body?: Record<string, unknown> | null | undefined;
        query?: Record<string, unknown> | null | undefined;
        approved?: boolean | undefined;
    }>, z.ZodObject<{
        requests: z.ZodArray<z.ZodObject<{
            method: z.ZodString;
            path: z.ZodString;
            query: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            body: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, "strip", z.ZodTypeAny, {
            method: string;
            path: string;
            body?: Record<string, unknown> | null | undefined;
            query?: Record<string, unknown> | null | undefined;
        }, {
            method: string;
            path: string;
            body?: Record<string, unknown> | null | undefined;
            query?: Record<string, unknown> | null | undefined;
        }>, "many">;
        approved: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        requests: {
            method: string;
            path: string;
            body?: Record<string, unknown> | null | undefined;
            query?: Record<string, unknown> | null | undefined;
        }[];
        approved?: boolean | undefined;
    }, {
        requests: {
            method: string;
            path: string;
            body?: Record<string, unknown> | null | undefined;
            query?: Record<string, unknown> | null | undefined;
        }[];
        approved?: boolean | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    input: {
        method: "DELETE" | "POST" | "GET" | "PUT" | "PATCH";
        path: string;
        body?: Record<string, unknown> | null | undefined;
        query?: Record<string, unknown> | null | undefined;
        approved?: boolean | undefined;
    } | {
        requests: {
            method: string;
            path: string;
            body?: Record<string, unknown> | null | undefined;
            query?: Record<string, unknown> | null | undefined;
        }[];
        approved?: boolean | undefined;
    };
    toolName: "http.request" | "http.bulk";
}, {
    input: {
        path: string;
        method?: "DELETE" | "POST" | "GET" | "PUT" | "PATCH" | undefined;
        body?: Record<string, unknown> | null | undefined;
        query?: Record<string, unknown> | null | undefined;
        approved?: boolean | undefined;
    } | {
        requests: {
            method: string;
            path: string;
            body?: Record<string, unknown> | null | undefined;
            query?: Record<string, unknown> | null | undefined;
        }[];
        approved?: boolean | undefined;
    };
    toolName: "http.request" | "http.bulk";
}>;
//# sourceMappingURL=execute.schema.d.ts.map