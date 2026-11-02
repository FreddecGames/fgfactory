export const formatTime = (seconds: number): string => {

	seconds = Math.ceil(seconds)
	if (seconds <= 0) return '00:00:00'

	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = seconds % 60

	const hStr = String(h).padStart(2, '0')
	const mStr = String(m).padStart(2, '0')
	const sStr = String(s).padStart(2, '0')

	return `${hStr}:${mStr}:${sStr}`
}