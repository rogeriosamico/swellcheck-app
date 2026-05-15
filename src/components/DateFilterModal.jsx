import React, { useState } from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

/**
 * Componente de Filtro de Data Reutilizável
 * 
 * @param {string} initialDate - Data atual no formato ISO (YYYY-MM-DD)
 * @param {function} onApply - Função chamada ao clicar em aplicar, recebe a data ISO
 * @param {React.ReactNode} trigger - O elemento que dispara a abertura do modal
 */
export default function DateFilterModal({ initialDate, onApply, trigger }) {
  const [open, setOpen] = useState(false);
  
  // Converter ISO string para Date para o react-day-picker
  const initialDateObj = initialDate ? parseISO(initialDate) : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDateObj);
  const [month, setMonth] = useState(initialDateObj);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  
  const isTodaySelected = selectedDate && isSameDay(selectedDate, today);

  const handleGoToToday = () => {
    setSelectedDate(today);
    setMonth(today);
  };

  const handleApply = () => {
    if (selectedDate) {
      // Formatar de volta para ISO string (YYYY-MM-DD)
      onApply(format(selectedDate, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[380px] p-6 gap-0">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-token-headline">Filtrar por data</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6">
          {/* Botão Hoje */}
          <div>
            <Button 
              disabled={isTodaySelected}
              onClick={handleGoToToday}
              className="px-6 disabled:opacity-30"
            >
              Hoje
            </Button>
          </div>

          {/* Calendário */}
          <div className="w-full relative">
            <Calendar 
              mode="single"
              locale={ptBR}
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={month}
              onMonthChange={setMonth}
              disabled={[{ before: today }, { after: maxDate }]}
              className="p-0 border-0 w-full [&_table]:w-full [&_tbody]:w-full [&_thead]:w-full"
              classNames={{
                root: "w-full",
                months: "w-full",
                month: "space-y-6 w-full",
                caption: "relative flex justify-center items-center h-10 mb-2 capitalize font-bold",
                nav: "absolute inset-x-0 flex justify-between items-center w-full z-10",
                button_previous: "h-10 w-10 flex items-center justify-center border border-[var(--border-primary)] rounded-[var(--radius-minimal)] bg-transparent hover:bg-[var(--surface-terciary)] transition-colors",
                button_next: "h-10 w-10 flex items-center justify-center border border-[var(--border-primary)] rounded-[var(--radius-minimal)] bg-transparent hover:bg-[var(--surface-terciary)] transition-colors",
                table: "w-full border-collapse table-fixed",
                head_row: "flex w-full",
                head_cell: "flex-1 text-[var(--text-secondary)] font-normal text-subtitle text-center",
                row: "flex w-full mt-2",
                day: "flex-1 flex items-center justify-center p-0 relative focus-within:z-20 aspect-square",
                day_button: "h-10 w-10 flex items-center justify-center transition-colors rounded-[var(--radius-minimal)]",
                selected: "bg-transparent",
                today: "bg-transparent",
                outside: "text-[var(--text-secondary)] opacity-50",
                disabled: "text-[var(--text-secondary)] opacity-50",
              }}
            />
          </div>

          {/* Info Texto */}
          <p className="text-center text-subtitle text-[var(--text-secondary)] mt-2">
            Previsão disponível para os próximos 7 dias
          </p>
        </div>
        
        <div className="mt-8 flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="flex-1 h-12"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleApply}
            className="flex-1 h-12"
          >
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
