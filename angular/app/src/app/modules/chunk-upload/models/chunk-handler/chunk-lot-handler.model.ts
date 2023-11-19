import { ChunkHandler } from "./chunk-handler.model";

export class ChunkLotHandler {

    private parallelHashLimit = 100;

    constructor(
        public chunkHandlers: ChunkHandler[]
    ) { }

    public hashFiles(): Promise<ChunkHandler[]> {
        const totalHandlers = this.chunkHandlers?.length;
        let complete = false;
        return new Promise(async (resolve, reject) => {
            let offset = 0;
            do {
                const offsetStart = offset;
                let offsetEnd = offset + this.parallelHashLimit;

                if (offsetEnd > totalHandlers) {
                    offsetEnd = totalHandlers;
                    complete = true;
                } else if (offsetEnd === totalHandlers) {
                    complete = true;
                }

                const handlers = this.chunkHandlers.slice(offsetStart, offsetEnd);

                await Promise.allSettled(handlers.map((chunkHandler) => chunkHandler.hashFile()))
                    .then((result) => {
                        const fullfiled = (result.filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<ChunkHandler>[]);
                        const rejected = (result.filter((r) => r.status === 'rejected') as PromiseRejectedResult[]);

                        return fullfiled.map((hash) => hash.value);
                    })

                offset += this.parallelHashLimit;
            } while (!complete)
            resolve(this.chunkHandlers);
        })
    }

}