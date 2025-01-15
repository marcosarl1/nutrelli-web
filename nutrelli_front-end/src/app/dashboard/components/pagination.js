import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

export const Pagination = ({
                               currentPage,
                               totalPages,
                               totalElements,
                               pageSize,
                               onPageChange,
                               itemsLabel
                           }) => {
    const currentItems = Math.min(pageSize, totalElements - (currentPage - 1) * pageSize);

    const renderPageNumbers = () => {
        const pagesToShow = 3;
        let startPage = Math.max(1, Math.min(currentPage - Math.floor(pagesToShow / 2), totalPages - pagesToShow + 1));
        let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

        if (endPage - startPage + 1 < pagesToShow) {
            startPage = Math.max(1, endPage - pagesToShow + 1);
        }

        const pages = [];
        if (startPage > 1) {
            pages.unshift(
                <span key={"start-ellipsis"} className="flex items-center px-2">...</span>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    variant={currentPage === i ? "outline" : "ghost"}
                    key={i}
                    onClick={() => onPageChange(i)}>
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <span key={"end-ellipsis"} className="flex items-center px-2">...</span>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                Mostrando {currentItems} de {totalElements} {itemsLabel}
            </p>
            <div className="flex justify-center gap-1 sm:gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}>
                    <ChevronLeft className="h-4 w-4"/>
                </Button>
                {renderPageNumbers()}
                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}>
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    );
}