
drop trigger if exists trg_cuenta_saldo_inicial on public.cuenta;

create trigger trg_cuenta_saldo_inicial
after insert on public.cuenta
for each row
execute function public.trg_cuenta_saldo_inicial();