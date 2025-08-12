import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './modules/banner/banner.module';
import { CaixaModule } from './modules/caixa/caixa.module';
import { CategoryModule } from './modules/category/category.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GroupAdicionaisModule } from './modules/group-adicionais/group-adicionais.module';
import { IntegrationsModule } from './modules/Integrations/integrations.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { PrintersModule } from './modules/printers/printers.module';
import { ProductsModule } from './modules/products/products.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TablesModule } from './modules/tables/tables.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SettingsModule,
    PrintersModule,
    TablesModule,
    ProductsModule,
    CategoryModule,
    RestaurantsModule,
    DashboardModule,
    BannerModule,
    PedidosModule,
    GroupAdicionaisModule,
    PaymentMethodModule,
    PaymentsModule,
    CaixaModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
