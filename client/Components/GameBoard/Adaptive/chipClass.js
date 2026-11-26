import classNames from 'classnames';

// The adaptive board's button style, as the prompt's options have it; a way out (cancel) is grey, as on the classic
// board
export const chipClass = (quiet) =>
    classNames(
        'min-w-0 gap-1 rounded-md border px-2 text-xs font-semibold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[background-color,border-color,color,box-shadow] duration-150 data-[pressed=true]:bg-amber-400/20 data-[disabled=true]:opacity-40',
        quiet
            ? 'border-zinc-400/70 bg-zinc-700/80 text-zinc-100 data-[hovered=true]:border-zinc-300 data-[hovered=true]:bg-zinc-600 data-[hovered=true]:text-white'
            : 'border-amber-400/70 bg-black/70 text-amber-100 data-[hovered=true]:border-amber-300 data-[hovered=true]:bg-amber-400/15 data-[hovered=true]:text-white data-[hovered=true]:shadow-[0_0_8px_rgba(251,191,36,0.45)]'
    );
