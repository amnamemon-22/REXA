/** Loads published evaluation artifacts shipped with the frontend, not live model output. */
export const evaluationService = {
  async loadStaticArtifacts<TMetrics, TComparison>(): Promise<[TMetrics, TComparison | null]> {
    const [metricsResponse, comparisonResponse] = await Promise.all([
      fetch('/evaluation/metrics.json'),
      fetch('/evaluation/comparison_tables.json').catch(() => null),
    ])

    if (!metricsResponse.ok) {
      throw new Error('Static evaluation metrics file not found. Run generate_fyp_figures.py first.')
    }

    const metrics = await metricsResponse.json() as TMetrics
    const comparison = comparisonResponse?.ok
      ? await comparisonResponse.json() as TComparison
      : null

    return [metrics, comparison]
  },
}
