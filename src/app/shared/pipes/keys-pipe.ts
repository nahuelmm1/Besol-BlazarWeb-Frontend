import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'mapKeys',  pure: false })
export class KeysPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Array.from( value.keys() );
    }
}