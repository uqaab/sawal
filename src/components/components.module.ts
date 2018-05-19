import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin';
import { QueriesComponent } from './queries/queries';
import { AskComponent } from './ask/ask';
import { ConfirmComponent } from './confirm/confirm';
@NgModule({
	declarations: [AdminComponent,
    QueriesComponent,
    AskComponent,
    ConfirmComponent],
	imports: [],
	exports: [AdminComponent,
    QueriesComponent,
    AskComponent,
    ConfirmComponent]
})
export class ComponentsModule {}
