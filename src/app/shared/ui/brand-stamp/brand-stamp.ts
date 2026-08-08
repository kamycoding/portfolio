import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-brand-stamp',
  templateUrl: './brand-stamp.html',
  styleUrl: './brand-stamp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandStamp {
  private static nextInstanceId = 0;

  protected readonly textPathId = `brand-stamp-path-${BrandStamp.nextInstanceId++}`;
  protected readonly textPathHref = `#${this.textPathId}`;
}
