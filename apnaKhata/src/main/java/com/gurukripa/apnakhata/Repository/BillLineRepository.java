package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.BillLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BillLineRepository extends JpaRepository<BillLine, Long> {
    /** Top‐selling items by quantity across all released bills. */
    @Query("""
      SELECT line.itemName, SUM(line.quantity)
      FROM BillLine line
      JOIN line.bill b
      WHERE b.releasedAt IS NOT NULL
      GROUP BY line.itemName
      ORDER BY SUM(line.quantity) DESC
    """)
    List<Object[]> findTopSellingItems();

    @Query(value = """
  SELECT
    period,
    SUM(total_qty) AS total_qty
  FROM (
    SELECT
      FORMATDATETIME(b.released_at, :pattern) AS period,
      l.quantity                       AS total_qty
    FROM bills b
    JOIN bill_lines l ON b.id = l.bill_id
    WHERE b.released_at BETWEEN :from AND :to
  ) t
  GROUP BY period
  ORDER BY period
  """,
            nativeQuery = true)
    List<Object[]> aggregateQuantity(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to,
            @Param("pattern") String pattern
    );

    @Query("""
  SELECT CAST(b.releasedAt AS date)       AS day,
    line.itemName                    AS item,
    SUM(line.quantity)               AS total
  FROM BillLine line
  JOIN line.bill b
  WHERE b.releasedAt BETWEEN :from AND :to
  GROUP BY 
    CAST(b.releasedAt AS date), 
    line.itemName
  ORDER BY 
    CAST(b.releasedAt AS date) ASC, 
    SUM(line.quantity)    DESC
""")
    List<Object[]> aggregateTopItemSales(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to
    );





}
