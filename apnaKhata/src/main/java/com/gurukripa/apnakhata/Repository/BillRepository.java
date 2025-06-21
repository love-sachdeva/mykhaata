package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    /** Sum of released‐status bill totals over a time window. */
    @Query("""
      SELECT SUM(line.lineTotal)
      FROM Bill b
      JOIN b.lines line
      WHERE b.releasedAt BETWEEN :from AND :to
    """)
    Double sumTotalSales(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to
    );

    /** Count of released bills in window. */
    @Query("""
      SELECT COUNT(b)
      FROM Bill b
      WHERE b.releasedAt BETWEEN :from AND :to
    """)
    Long countReleased(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to
    );

    /** Sum of all item‐quantities in released bills. */
    @Query("""
      SELECT SUM(line.quantity)
      FROM Bill b
      JOIN b.lines line
      WHERE b.releasedAt BETWEEN :from AND :to
    """)
    Long sumItemsSold(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to
    );

    @Query(
            value = """
        SELECT
            CAST(b.released_at AS DATE) AS "day",
            SUM(l.line_total)          AS total
        FROM   bills b
        JOIN   bill_lines l ON b.id = l.bill_id
        WHERE  b.released_at BETWEEN :from AND :to
        GROUP  BY CAST(b.released_at AS DATE)
        ORDER  BY "day"
    """,
            nativeQuery = true
    )
    List<Object[]> aggregateSalesByDate(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to
    );

}