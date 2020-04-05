import gulp from 'gulp';
import gulpif from 'gulp-if';

import { PRODUCTION } from '../config';
import PATHS from '../paths';

export default function dist() {
	return gulp.src(PATHS.dist.from).pipe(gulpif(PRODUCTION, gulp.dest(PATHS.dist.to)));
}
