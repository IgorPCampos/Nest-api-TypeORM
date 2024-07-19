import { Module } from "@nestjs/common";
import { PrimsaService } from "./prisma.service";

@Module({
    providers: [PrimsaService],
    exports: [PrimsaService]
})
export class PrismaModule {}
