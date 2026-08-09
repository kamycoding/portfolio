import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly documentTitle = inject(Title);
  private readonly translate = inject(TranslateService);
  private readonly titleKey = signal<string | null>(null);
  private readonly translatedTitle = this.translate.translate(() => this.titleKey() ?? '');

  constructor() {
    super();

    effect(() => {
      if (this.titleKey()) {
        this.documentTitle.setTitle(String(this.translatedTitle()));
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.findDeepestTitleKey(snapshot);

    if (titleKey) {
      this.titleKey.set(titleKey);
      return;
    }

    this.titleKey.set(null);

    const title = this.buildTitle(snapshot);

    if (title) {
      this.documentTitle.setTitle(title);
    }
  }

  private findDeepestTitleKey(snapshot: RouterStateSnapshot): string | null {
    let route = snapshot.root;
    let titleKey: string | null = null;

    while (route) {
      if (typeof route.data['titleKey'] === 'string') {
        titleKey = route.data['titleKey'];
      }

      const [child] = route.children;

      if (!child) {
        break;
      }

      route = child;
    }

    return titleKey;
  }
}
