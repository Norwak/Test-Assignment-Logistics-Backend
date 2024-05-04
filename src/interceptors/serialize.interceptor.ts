import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

interface ClassConstructor {
  new (...args: any[]): {};
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(
    private dto: any
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      
    // Do something before the request is handled by the request handler

    return next.handle().pipe(
      map((data: any) => {

        // do something before the response is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });

      })
    );
  }
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}