import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from '@n8n/typeorm';
import type { ExecutionAnnotation } from './ExecutionAnnotation';
import type { AnnotationTagEntity } from './AnnotationTagEntity';

/**
 * This entity represents the junction table between the execution annotations and the tags
 */
@Entity({ name: 'execution_annotation_tags' })
export class AnnotationTagMapping {
	@PrimaryColumn()
	annotationId: number;

	@ManyToOne('ExecutionAnnotation', 'tagMappings')
	@JoinColumn({ name: 'annotationId' })
	annotations: ExecutionAnnotation[];

	@PrimaryColumn()
	tagId: string;

	@ManyToOne('AnnotationTagEntity', 'annotationMappings')
	@JoinColumn({ name: 'tagId' })
	tags: AnnotationTagEntity[];
}
