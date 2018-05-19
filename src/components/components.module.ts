import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin';
import { QueriesComponent } from './queries/queries';
import { AskComponent } from './ask/ask';
@NgModule({
	declarations: [AdminComponent,
    QueriesComponent,
    AskComponent],
	imports: [],
	exports: [AdminComponent,
    QueriesComponent,
    AskComponent]
})
export class ComponentsModule {}
