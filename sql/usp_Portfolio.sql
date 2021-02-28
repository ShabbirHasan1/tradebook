CREATE PROCEDURE [dbo].[usp_Portfolio]
(
	@period	   int,
	@exchange  nvarchar(50),
	@exits bit = 0
)
AS
BEGIN
	SET NOCOUNT ON;

	WITH CTE_Data
	AS
		(
			SELECT
				t.symbol,
				t.quantity,
				t.exchange,
				t.trade_type,
				t.price,
				period = (YEAR(t.trade_date) * 100 + MONTH(t.trade_date))
				FROM
					Tradebook t
				WHERE
					t.exchange = @exchange
					AND (YEAR(t.trade_date) * 100 + MONTH(t.trade_date)) <= @period
		),
	CTE_Summary
	AS
		(
			SELECT
				period = @period,
				e.symbol,
				e.name,
				total_sell_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'sell'
				), 0),
				total_buy_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'buy'
				), 0),
				avg_buy =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price) / SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'buy'

				), 0),
				avg_sell =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price) / SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'sell'

				), 0),
				buy_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'buy'
				), 0),
				sell_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'sell'
				), 0),
				buy_amt =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'buy'
				), 0),
				sell_amt =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'sell'
				), 0)
				FROM
					Equity e
				WHERE
					EXISTS
					(
						SELECT
							1
							FROM
								Tradebook t
							WHERE
								e.symbol = t.symbol
								AND t.exchange = @exchange
								AND e.exchange = t.exchange
								AND (YEAR(t.trade_date) * 100 + MONTH(t.trade_date)) <= @period
					)
		)
	SELECT
		cs.symbol,
		cs.name,
		cs.buy_qty,
		cs.sell_qty,
		avg_buy_price =	 ROUND(cs.avg_buy, 2),
		avg_sell_price = ROUND(cs.avg_sell, 2),
		pnl =			 ROUND((cs.total_sell_qty * cs.avg_sell) - (cs.total_sell_qty * cs.avg_buy), 2)
		FROM
			CTE_Summary cs
		WHERE
			(cs.buy_qty > 0 OR cs.sell_qty > 0)
			AND 1 = (CASE @exits
				WHEN 0 THEN 1
				WHEN 1 THEN CASE
							WHEN cs.total_sell_qty = cs.total_buy_qty
								AND cs.sell_qty > 0 THEN 1
							ELSE 0
						END
			END)
		ORDER BY
			1;
END