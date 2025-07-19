import { Module, OnApplicationShutdown } from '@nestjs/common';
import { TeaModule } from './tea/tea.module';

@Module({
  imports: [TeaModule],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    if (signal === 'SIGINT') {
      console.log('Bye tea‑lovers 👋');
    }
  }
}
